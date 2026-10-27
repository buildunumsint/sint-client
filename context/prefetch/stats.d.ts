interface UserStatsCounts {
  total_users: number;
  total_parishioners: number;
  total_priests: number;
  total_parish_admins: number;
}

// Today's counts, plus the same counts as of `days` ago under `previous`.
interface StatsType extends UserStatsCounts {
  days: number;
  previous: UserStatsCounts;
}

// Verified installs = devices that granted push permission and registered.
interface DeviceStatsType {
  days: number;
  verified_installs: number;
  previous_verified_installs: number;
  by_platform: { ios: number; android: number };
  // Opened the app within the last `days` days.
  active: number;
  // Linked to a signed-in account at the latest registration.
  signed_in: number;
}
