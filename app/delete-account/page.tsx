import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Delete Your Account — Unum Sint",
  description:
    "How to request deletion of your Unum Sint account and what data is removed or retained.",
  robots: { index: true, follow: true },
};

const SUPPORT_EMAIL = "buildunumsint@gmail.com";
const LAST_UPDATED = "24 July 2026";

export default function DeleteAccountPage() {
  return (
    <main className="min-h-screen bg-white text-[#171717]">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <p className="text-sm font-medium text-[#7834bb]">Unum Sint</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Delete your account
        </h1>
        <p className="mt-4 text-base leading-7 text-gray-600">
          You can request deletion of your Unum Sint account and associated
          personal data at any time. This page explains how, and what happens to
          your information.
        </p>

        {/* In-app */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Option 1 — Delete in the app</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-gray-700">
            <li>Open the Unum Sint mobile app and sign in.</li>
            <li>
              Go to the <span className="font-medium">Profile</span> tab.
            </li>
            <li>
              Tap <span className="font-medium">Delete account</span> and
              confirm.
            </li>
          </ol>
          <p className="mt-3 text-sm text-gray-500">
            Deletion is processed immediately once confirmed.
          </p>
        </section>

        {/* Email */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Option 2 — Request by email</h2>
          <p className="mt-4 text-gray-700">
            If you can&apos;t access the app, email us from the address on your
            account and we&apos;ll process the deletion within 30 days.
          </p>
          <a
            href={`mailto:${SUPPORT_EMAIL}?subject=Account%20deletion%20request`}
            className="mt-4 inline-block rounded-lg bg-[#7834bb] px-5 py-2.5 font-medium text-white transition-colors hover:bg-[#6529a3]"
          >
            Email {SUPPORT_EMAIL}
          </a>
        </section>

        {/* What is deleted */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold">What we delete</h2>
          <p className="mt-4 text-gray-700">
            When your account is deleted, we permanently remove the personal data
            that identifies you:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-700">
            <li>Your name, email address, phone number, and postal address</li>
            <li>Your date of birth and profile details</li>
            <li>Your login credentials and all active sign-in sessions</li>
            <li>Your parish memberships, roles, and app permissions</li>
          </ul>
          <p className="mt-3 text-sm text-gray-500">
            After deletion your account can no longer be signed into, and your
            identifying details are removed from our systems.
          </p>
        </section>

        {/* What is retained */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold">What we retain</h2>
          <p className="mt-4 text-gray-700">
            Unum Sint maintains official parish sacramental records — baptisms,
            first communions, confirmations, holy orders, and marriages. These
            are the parish&apos;s permanent canonical register and are kept for
            legitimate religious and legal record-keeping reasons, even after an
            account is deleted. Where possible these records are disassociated
            from your login. A marriage record, for example, also belongs to your
            spouse and cannot be erased by one party alone.
          </p>
          <p className="mt-4 text-gray-700">
            If you believe a sacramental record should be corrected or removed,
            contact your parish or email us at{" "}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="font-medium text-[#7834bb] underline"
            >
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
        </section>

        <hr className="my-10 border-gray-200" />
        <p className="text-sm text-gray-500">Last updated: {LAST_UPDATED}</p>
        <Link
          href="/"
          className="mt-4 inline-block text-sm font-medium text-[#7834bb] hover:underline"
        >
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
