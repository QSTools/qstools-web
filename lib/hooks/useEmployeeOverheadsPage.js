"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { calculateOverheadSummary } from "@/lib/calculations/overheadCalculations";
import { OVERHEAD_ITEMS } from "@/lib/constants/overheadConfig";
import { DEFAULT_FORM } from "@/lib/constants/overheadDefaults";
import {
  clearOverheadDraft,
  loadLabourProfiles,
  loadOverheadDraft,
  loadOverheadProfiles,
  saveOverheadDraft,
  saveOverheadProfiles,
} from "@/lib/storage/overheadStorage";
import {
  createOverheadProfile,
  deleteOverheadProfile,
  updateOverheadProfile,
  upsertProfile,
} from "@/lib/actions/overheadProfileActions";

function useSafeSearchParams() {
  const [params, setParams] = useState(new URLSearchParams());

  useEffect(() => {
    if (typeof window !== "undefined") {
      setParams(new URLSearchParams(window.location.search));
    }
  }, []);

  return params;
}

export default function useEmployeeOverheadsPage() {
  const router = useRouter();
  const searchParams = useSafeSearchParams();

  const [form, setForm] = useState(DEFAULT_FORM);
  const [profiles, setProfiles] = useState([]);
  const [labourProfiles, setLabourProfiles] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);

  function refreshStorageData() {
    setProfiles(loadOverheadProfiles());
    setLabourProfiles(loadLabourProfiles());
  }

  useEffect(() => {
    refreshStorageData();

    const savedDraft = loadOverheadDraft();
    if (savedDraft) {
      setForm((prev) => ({ ...prev, ...savedDraft }));
    }

    setIsHydrated(true);
  }, []);

  useEffect(() => {
    function handleFocus() {
      refreshStorageData();
    }

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    saveOverheadProfiles(profiles);
  }, [profiles, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    saveOverheadDraft(form);
  }, [form, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;

    const overheadProfileIdFromQuery =
      searchParams.get("overheadProfileId") || "";

    if (!overheadProfileIdFromQuery) return;
    if (profiles.length === 0) return;

    const existingProfile = profiles.find(
      (profile) => String(profile.id) === String(overheadProfileIdFromQuery)
    );

    if (!existingProfile) return;

    setForm({
      ...DEFAULT_FORM,
      ...existingProfile,
      id: existingProfile.id,
    });
  }, [searchParams, profiles, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;

    const overheadProfileIdFromQuery =
      searchParams.get("overheadProfileId") || "";

    if (overheadProfileIdFromQuery) return;

    const staffNameFromQuery = searchParams.get("staffName") || "";
    const roleFromQuery = searchParams.get("role") || "";
    const labourProfileIdFromQuery = searchParams.get("labourProfileId") || "";

    if (!labourProfileIdFromQuery && !staffNameFromQuery && !roleFromQuery) {
      return;
    }

    const linkedLabourProfile =
      labourProfiles.find(
        (profile) => String(profile.id) === String(labourProfileIdFromQuery)
      ) || null;

    const existingLinkedOverhead =
      linkedLabourProfile
        ? profiles.find(
            (profile) =>
              String(profile.labourProfileId) === String(linkedLabourProfile.id)
          )
        : null;

    if (existingLinkedOverhead) {
      setForm({
        ...DEFAULT_FORM,
        ...existingLinkedOverhead,
        id: existingLinkedOverhead.id,
      });
      return;
    }

    setForm((prev) => {
      const next = {
        ...DEFAULT_FORM,
        ...prev,
        id: "",
        createdAt: "",
        updatedAt: "",
      };

      if (labourProfileIdFromQuery) {
        next.labourProfileId = labourProfileIdFromQuery;
      }

      if (linkedLabourProfile) {
        next.staffName = linkedLabourProfile.staffName || "";
        next.role = linkedLabourProfile.role || "";
        next.profileName = linkedLabourProfile.staffName
          ? `${linkedLabourProfile.staffName} - Standard`
          : "";
      } else {
        next.staffName = staffNameFromQuery || next.staffName || "";
        next.role = roleFromQuery || next.role || "";
        next.profileName = staffNameFromQuery
          ? `${staffNameFromQuery} - Standard`
          : next.profileName || "";
      }

      return next;
    });
  }, [searchParams, labourProfiles, profiles, isHydrated]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => {
      const updatedValue = type === "checkbox" ? checked : value;
      const updated = { ...prev, [name]: updatedValue };

      if (name === "staffName" && !prev.profileName) {
        updated.profileName = value ? `${value} - Standard` : "";
      }

      if (name === "vehicleEnabled" && !checked) {
        updated.vehicleType = prev.vehicleType || "company";
      }

      return updated;
    });
  }

  function handleLabourProfileSelect(e) {
    const selectedId = e.target.value;

    if (!selectedId) {
      setForm((prev) => ({
        ...DEFAULT_FORM,
        ...prev,
        id: "",
        createdAt: "",
        updatedAt: "",
        labourProfileId: "",
        staffName: "",
        role: "",
        profileName: "",
      }));
      return;
    }

    const selectedProfile = labourProfiles.find(
      (profile) => String(profile.id) === String(selectedId)
    );

    if (!selectedProfile) return;

    const existingLinkedOverhead = profiles.find(
      (profile) => String(profile.labourProfileId) === String(selectedProfile.id)
    );

    if (existingLinkedOverhead) {
      setForm({
        ...DEFAULT_FORM,
        ...existingLinkedOverhead,
        id: existingLinkedOverhead.id,
      });
      return;
    }

    setForm((prev) => ({
      ...DEFAULT_FORM,
      ...prev,
      id: "",
      createdAt: "",
      updatedAt: "",
      labourProfileId: selectedProfile.id,
      staffName: selectedProfile.staffName || "",
      role: selectedProfile.role || "",
      profileName: selectedProfile.staffName
        ? `${selectedProfile.staffName} - Standard`
        : "",
    }));
  }

  function handleLoadProfile(profileId) {
    const selectedProfile = profiles.find(
      (profile) => String(profile.id) === String(profileId)
    );

    if (!selectedProfile) return;

    setForm({
      ...DEFAULT_FORM,
      ...selectedProfile,
      id: selectedProfile.id,
    });

    router.replace(`/employee-overheads?overheadProfileId=${selectedProfile.id}`);
  }

  function handleNewProfile() {
    clearOverheadDraft();
    setForm(DEFAULT_FORM);
    router.replace("/employee-overheads");
  }

  const queryHoursPerWeek = Number(searchParams.get("hoursPerWeek") || 0);
  const queryEfficiencyPct = Number(searchParams.get("efficiencyPct") || 0);
  const queryStaffName = searchParams.get("staffName") || "";
  const queryRole = searchParams.get("role") || "";

  const selectedLabourProfileFromStorage =
    labourProfiles.find(
      (profile) => String(profile.id) === String(form.labourProfileId)
    ) || null;

  const selectedLabourProfile =
    selectedLabourProfileFromStorage ||
    (queryHoursPerWeek > 0
      ? {
          id: form.labourProfileId || "query-fallback",
          staffName: form.staffName || queryStaffName,
          role: form.role || queryRole,
          hoursPerWeek: queryHoursPerWeek,
          efficiencyPct: queryEfficiencyPct,
        }
      : null);

  const summary = useMemo(() => {
    return calculateOverheadSummary({
      form,
      labourProfile: selectedLabourProfile,
      overheadItems: OVERHEAD_ITEMS,
    });
  }, [form, selectedLabourProfile]);

  function handleSaveOrUpdate() {
    const existingLinkedProfile = profiles.find(
      (p) =>
        String(p.labourProfileId) === String(selectedLabourProfile?.id || "")
    );

    const shouldUpdateExisting =
      Boolean(form.id) &&
      profiles.some((p) => String(p.id) === String(form.id)) &&
      String(form.labourProfileId || "") === String(selectedLabourProfile?.id || "");

    if (shouldUpdateExisting) {
      const existingProfile = profiles.find(
        (p) => String(p.id) === String(form.id)
      );

      const updatedProfile = updateOverheadProfile({
        existingProfile,
        form,
        summary,
        selectedLabourProfile,
      });

      const updatedProfiles = upsertProfile(profiles, updatedProfile);

      setProfiles(updatedProfiles);
      saveOverheadProfiles(updatedProfiles);
      clearOverheadDraft();
      setForm(updatedProfile);

      router.push(`/labour-rates?overheadProfileId=${updatedProfile.id}`);
      return;
    }

    if (existingLinkedProfile) {
      const updatedProfile = updateOverheadProfile({
        existingProfile: existingLinkedProfile,
        form: {
          ...form,
          id: existingLinkedProfile.id,
        },
        summary,
        selectedLabourProfile,
      });

      const updatedProfiles = upsertProfile(profiles, updatedProfile);

      setProfiles(updatedProfiles);
      saveOverheadProfiles(updatedProfiles);
      clearOverheadDraft();
      setForm(updatedProfile);

      router.push(`/labour-rates?overheadProfileId=${updatedProfile.id}`);
      return;
    }

    const newProfile = createOverheadProfile({
      form: {
        ...form,
        id: "",
      },
      summary,
      selectedLabourProfile,
    });

    const updatedProfiles = [newProfile, ...profiles];

    setProfiles(updatedProfiles);
    saveOverheadProfiles(updatedProfiles);
    clearOverheadDraft();
    setForm(newProfile);

    router.push(`/labour-rates?overheadProfileId=${newProfile.id}`);
  }

  function handleDelete(id) {
    const updatedProfiles = deleteOverheadProfile(profiles, id);
    setProfiles(updatedProfiles);
    saveOverheadProfiles(updatedProfiles);

    if (String(form.id) === String(id)) {
      clearOverheadDraft();
      setForm(DEFAULT_FORM);
      router.replace("/employee-overheads");
    }
  }

  return {
    form,
    setForm,
    profiles,
    labourProfiles,
    isHydrated,
    selectedLabourProfile,
    summary,
    handleChange,
    handleLabourProfileSelect,
    handleLoadProfile,
    handleNewProfile,
    handleSaveOrUpdate,
    handleDelete,
    router,
  };
}