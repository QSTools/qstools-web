"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  loadLabourProfiles,
  saveLabourProfiles,
  loadLabourDraft,
  saveLabourDraft,
  clearLabourDraft,
  loadOverheadProfiles,
} from "@/lib/storage/labourStorage";
import {
  buildLabourProfile,
  insertProfile,
  replaceProfile,
  removeProfile,
  buildDuplicatedLabourProfile,
} from "@/lib/actions/labourProfileActions";
import {
  DEFAULT_FORM,
  normaliseFormForCalculation,
  calculateOverheadValues,
} from "@/lib/calculations/labourPageHelpers";

export default function useLabourRatesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState(DEFAULT_FORM);
  const [profiles, setProfiles] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [overheadProfiles, setOverheadProfiles] = useState([]);
  const [selectedOverheadProfileId, setSelectedOverheadProfileId] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);

  function loadOverheadProfilesFromStorage() {
    setOverheadProfiles(loadOverheadProfiles());
  }

  function handleEdit(profile) {
    setForm({
      ...DEFAULT_FORM,
      ...profile,
    });

    setEditingId(profile.id);
    setSelectedOverheadProfileId(profile.selectedOverheadProfileId || "");

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  useEffect(() => {
    const savedProfiles = loadLabourProfiles();
    setProfiles(savedProfiles);
    loadOverheadProfilesFromStorage();

    const savedDraft = loadLabourDraft();

    if (savedDraft) {
      if (savedDraft?.form) {
        setForm({ ...DEFAULT_FORM, ...savedDraft.form });
        setSelectedOverheadProfileId(savedDraft.selectedOverheadProfileId || "");

        const draftEditingId = savedDraft.editingId || null;
        const draftProfileExists = savedProfiles.some(
          (profile) => String(profile.id) === String(draftEditingId)
        );

        setEditingId(draftProfileExists ? draftEditingId : null);
      } else {
        setForm({ ...DEFAULT_FORM, ...savedDraft });
        setEditingId(null);
      }
    }

    setIsHydrated(true);
  }, []);

  useEffect(() => {
    function handleFocus() {
      loadOverheadProfilesFromStorage();
    }

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    saveLabourProfiles(profiles);
  }, [profiles, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;

    const editingProfileExists = profiles.some(
      (profile) => String(profile.id) === String(editingId)
    );

    saveLabourDraft({
      form,
      selectedOverheadProfileId,
      editingId: editingProfileExists ? editingId : null,
    });
  }, [form, selectedOverheadProfileId, editingId, profiles, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;

    const overheadProfileIdFromQuery =
      searchParams.get("overheadProfileId") || "";

    if (!overheadProfileIdFromQuery) return;

    const exists = overheadProfiles.some(
      (profile) => String(profile.id) === String(overheadProfileIdFromQuery)
    );

    if (!exists) return;

    setSelectedOverheadProfileId(overheadProfileIdFromQuery);

    setProfiles((prev) =>
      prev.map((profile) =>
        String(profile.id) === String(editingId)
          ? {
              ...profile,
              selectedOverheadProfileId: overheadProfileIdFromQuery,
            }
          : profile
      )
    );

    router.replace("/labour-rates");
  }, [searchParams, overheadProfiles, editingId, router, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;

    const editIdFromQuery = searchParams.get("edit");

    if (!editIdFromQuery) return;

    const profileToEdit = profiles.find(
      (profile) => String(profile.id) === String(editIdFromQuery)
    );

    if (profileToEdit) {
      handleEdit(profileToEdit);
    } else {
      setEditingId(null);
    }

    router.replace("/labour-rates");
  }, [searchParams, profiles, isHydrated, router]);

  const selectedOverheadProfile =
    overheadProfiles.find(
      (profile) => String(profile.id) === String(selectedOverheadProfileId)
    ) || null;

  const totalAnnualOverhead = Number(
    selectedOverheadProfile?.totalAnnualOverhead || 0
  );

  const {
    paidHoursPerYear,
    productiveHoursPerYear,
    overheadPerPaidHour,
    overheadPerProductiveHour,
  } = calculateOverheadValues(form, totalAnnualOverhead);

  const results = useMemo(() => {
    const profileForPreview = buildLabourProfile({
      form,
      selectedOverheadProfileId,
      overheadPerProductiveHour,
      normaliseFormForCalculation,
      forcedId: form.id || editingId || "preview",
    });

    return profileForPreview.results;
  }, [
    form,
    selectedOverheadProfileId,
    overheadPerProductiveHour,
    editingId,
  ]);

  function handleSave() {
  const newProfile = buildLabourProfile({
    form,
    selectedOverheadProfileId,
    overheadPerProductiveHour,
    normaliseFormForCalculation,
    forcedId: crypto.randomUUID(),
  });

  setProfiles((prev) => insertProfile(prev, newProfile));
  setForm(newProfile);
  setEditingId(newProfile.id);
  setSelectedOverheadProfileId(newProfile.selectedOverheadProfileId || "");
  clearLabourDraft();
}

  function handleUpdate() {
    const existingProfile = profiles.find(
      (profile) => String(profile.id) === String(editingId)
    );

    if (!existingProfile) {
      setEditingId(null);
      return;
    }

    const updatedProfile = buildLabourProfile({
      form,
      selectedOverheadProfileId,
      overheadPerProductiveHour,
      normaliseFormForCalculation,
      existingProfile,
      forcedId: editingId,
    });

    const updatedProfiles = replaceProfile(profiles, updatedProfile);

    setProfiles(updatedProfiles);
    setForm(updatedProfile);
    setEditingId(updatedProfile.id);
    clearLabourDraft();
  }

  function handleDelete(id) {
    setProfiles((prev) => removeProfile(prev, id));

    if (String(editingId) === String(id)) {
      clearLabourDraft();
      setForm(DEFAULT_FORM);
      setEditingId(null);
      setSelectedOverheadProfileId("");
    }
  }

  function handleDuplicate(profile) {
    const duplicatedProfile = buildDuplicatedLabourProfile({
      profile,
      overheadProfiles,
      defaultForm: DEFAULT_FORM,
      normaliseFormForCalculation,
    });

    setProfiles((prev) => insertProfile(prev, duplicatedProfile));
  }

  function handleClear() {
    clearLabourDraft();
    setForm(DEFAULT_FORM);
    setEditingId(null);
    setSelectedOverheadProfileId("");
  }

  function handleOverheadChange(e) {
    setSelectedOverheadProfileId(e.target.value);
  }

  return {
    form,
    setForm,
    profiles,
    editingId,
    overheadProfiles,
    selectedOverheadProfileId,
    selectedOverheadProfile,
    totalAnnualOverhead,
    paidHoursPerYear,
    productiveHoursPerYear,
    overheadPerPaidHour,
    overheadPerProductiveHour,
    results,
    isHydrated,
    handleSave,
    handleUpdate,
    handleEdit,
    handleDelete,
    handleDuplicate,
    handleClear,
    handleOverheadChange,
  };
}