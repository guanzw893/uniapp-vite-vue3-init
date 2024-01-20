const getCurrentFullRoute = () => {
  const route = getCurrentPages()
  return route[route.length - 1].$page?.fullPath as string
}

const getCurrentRoute = () => {
  return getCurrentFullRoute()?.split('?')[0]
}

export const useRoute = () => ({ getCurrentFullRoute, getCurrentRoute })
