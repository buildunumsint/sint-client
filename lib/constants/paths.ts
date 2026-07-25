export const staticPaths = {
  WAITLIST: "/waitlist",
  DENIED: "/access-denied",
  PRICING: "/pricing",
  DASHBOARD_PATHS: {
    home: "/dashboard",
  },
  PROJECT_PATHS: {
    new: "/projects/new",
  },
  AUTH_PATHS: {
    logout: "/auth/logout",
  },
};

export const dynamicPaths = (workspaceSlug: string | null) => {
  const authPaths = {
    login: (returnTo?: string) =>
      `/auth/login?screen_hint=signin&returnTo=${returnTo}`,
    register: (returnTo?: string) =>
      `/auth/login?screen_hint=signup&returnTo=${returnTo}`,
    logout: (returnTo?: string) => `/auth/logout?returnTo=${returnTo}`,
  };

  // const clientPaths = {
  //   newProject: (clientId: string) => `${clientsRoot}/${clientId}/new`,
  //   projects: (clientId: string) => `${clientsRoot}/${clientId}`,
  //   studio: (clientId: string, projectId: string) =>
  //     `${clientsRoot}/${clientId}/project/${projectId}`,
  // };

  // const projectPaths = {
  //   new: () => `${projectsRoot}/new`,
  //   studio: (projectId: string) => `${projectsRoot}/project/${projectId}`,
  // };

  // const organisationPaths = {
  //   projects: (organisationId: string) =>
  //     `${organisationsRoot}/${organisationId}`,
  //   project: (organisationId: string, projectId: string) =>
  //     `${organisationsRoot}/${organisationId}/project/${projectId}`,
  // };

  return {
    auth: authPaths,
  };
};
