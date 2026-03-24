"use client";

import { useEffect, useMemo, useState } from "react";
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

function canUseBrowser() {
  return typeof window !== "undefined";
}

function getQueryParams() {
  if (!canUseBrowser()) return new URLSearchParams();
  return new URLSearchParams(window.location.search);
}

function replaceUrl(path) {
  if (!canUseBrowser()) return;
  window.history.replaceState({}, "", path);
}

function safeRandomId() {
  if (
    typeof globalThis !== "undefined" &&
    globalThis.crypto &&
    typeof globalThis.crypto.randomUUID === "function"
  ) {
    return globalThis.crypto.randomUUID();
  }

  return `labour-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export default function useLabourRatesPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [profiles, setProfiles] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [overheadProfiles, setOverheadProfiles] = useState([]);
  const [selectedOverheadProfileId, setSelectedOverheadProfileId] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);

  function loadOverheadProfilesFromStorage() {
    const loaded = loadOverheadProfiles();
    setOverheadProfiles(Array.isArray(loaded) ? loaded : []);
  }

  function handleEdit(profile) {
    setForm({
      ...DEFAULT_FORM,
      ...profile,
    });

    setEditingId(profile.id);
    setSelectedOverheadProfileId(profile.selectedOverheadProfileId || "");

    if (canUseBrowser()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  useEffect(() => {
    const savedProfiles = loadLabourProfiles();
    const safeProfiles = Array.isArray(savedProfiles) ? savedProfiles : [];

    setProfiles(safeProfiles);
    loadOverheadProfilesFromStorage();

    const savedDraft = loadLabourDraft();

    if (savedDraft) {
      if (savedDraft?.form) {
        setForm({ ...DEFAULT_FORM, ...savedDraft.form });
        setSelectedOverheadProfileId(savedDraft.selectedOverheadProfileId || "");

        const draftEditingId = savedDraft.editingId || null;
        const draftProfileExists = safeProfiles.some(
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
    if (!canUseBrowser()) return;

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
    if (!isHydrated || !canUseBrowser()) return;

    const params = getQueryParams();
    const overheadProfileIdFromQuery = params.get("overheadProfileId") || "";

    if (!overheadProfileIdFromQuery) return;

    const exists = overheadProfiles.some(
      (profile) => String(profile.id) === String(overheadProfileIdFromQuery)
    );

    if (!exists) {
      replaceUrl("/labour-rates");
      return;
    }

    setSelectedOverheadProfileId(overheadProfileIdFromQuery);

    if (editingId) {
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
    }

    replaceUrl("/labour-rates");
  }, [overheadProfiles, editingId, isHydrated]);

  useEffect(() => {
    if (!isHydrated || !canUseBrowser()) return;

    const params = getQueryParams();
    const editIdFromQuery = params.get("edit");

    if (!editIdFromQuery) return;

    const profileToEdit = profiles.find(
      (profile) => String(profile.id) === String(editIdFromQuery)
    );

    if (profileToEdit) {
      handleEdit(profileToEdit);
    } else {
      setEditingId(null);
    }

    replaceUrl("/labour-rates");
  }, [profiles, isHydrated]);

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

  const safePaidHoursPerYear = Number(paidHoursPerYear || 0);
  const safeProductiveHoursPerYear = Number(productiveHoursPerYear || 0);
  const safeOverheadPerPaidHour = Number(overheadPerPaidHour || 0);
  const safeOverheadPerProductiveHour = Number(overheadPerProductiveHour || 0);

  const results = useMemo(() => {
    const profileForPreview = buildLabourProfile({
      form,
      selectedOverheadProfileId,
      overheadPerProductiveHour: safeOverheadPerProductiveHour,
      normaliseFormForCalculation,
      forcedId: form.id || editingId || "preview",
    });

    return profileForPreview?.results || null;
  }, [
    form,
    selectedOverheadProfileId,
    safeOverheadPerProductiveHour,
    editingId,
  ]);

  function handleSave() {
    const newProfile = buildLabourProfile({
      form,
      selectedOverheadProfileId,
      overheadPerProductiveHour: safeOverheadPerProductiveHour,
      normaliseFormForCalculation,
      forcedId: safeRandomId(),
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
      overheadPerProductiveHour: safeOverheadPerProductiveHour,
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
    paidHoursPerYear: safePaidHoursPerYear,
    productiveHoursPerYear: safeProductiveHoursPerYear,
    overheadPerPaidHour: safeOverheadPerPaidHour,
    overheadPerProductiveHour: safeOverheadPerProductiveHour,
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