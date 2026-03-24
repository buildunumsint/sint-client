export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Settings
        </h1>
        {/* <p className="mt-1 text-sm text-zinc-600">
          Placeholder page — add profile/org settings here.
        </p> */}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200/70">
          <p className="text-sm font-semibold text-zinc-900">Account</p>
          <p className="mt-1 text-sm text-zinc-600">
            Manage your login and personal information.
          </p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200/70">
          <p className="text-sm font-semibold text-zinc-900">Preferences</p>
          <p className="mt-1 text-sm text-zinc-600">
            Configure notifications and appearance.
          </p>
        </div>
      </div>
    </div>
  );
}

