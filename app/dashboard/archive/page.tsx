"use client";

import { Suspense } from "react";
import AllSacraments from "./_shared/AllSacraments";
import TitleHeader from "./_shared/TitleHeader";
import AddRecordButton from "./_shared/ buttons/AddRecordButton";
import ArchiveSearchBar from "./_shared/header/ArchiveSearchBar";

function ArchivePageContent() {
  return (
    <div className="space-y-10">
      <TitleHeader title="Sacramental Records">
        <div className="flex w-full gap-10">
          <ArchiveSearchBar />
          <AddRecordButton sacramentType={null} />
        </div>
      </TitleHeader>
      <AllSacraments />
    </div>
  );
}

export default function ArchivePage() {
  return (
    <Suspense fallback={<div className="min-h-48 space-y-10" />}>
      <ArchivePageContent />
    </Suspense>
  );
}
