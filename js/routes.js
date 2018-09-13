routes = [
    {
      path: '/',
      url: './index.html',
    },
    {
      path: '/pesoIdeal/',
      url: './pages/pesoIdeal.html',
    },
    {
      path: '/sobre/',
      url: './pages/sobre.html',
    },
    // Default route (404 page). MUST BE THE LAST
    {
      path: '(.*)',
      url: './pages/404.html',
    },
  ];