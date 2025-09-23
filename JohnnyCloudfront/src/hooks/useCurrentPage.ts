import { useLocation } from "react-router-dom";

export function useCurrentPage() {
  const location = useLocation();
  
  const getPageName = (pathname: string) => {
    switch (pathname) {
      case '/':
        return 'home';
      case '/metrics':
        return 'metrics';
      case '/guardrails':
        return 'guardrails';
      case '/why-aws':
        return 'why-aws';
      case '/about':
        return 'about';
      case '/faq':
        return 'faq';
      default:
        return 'unknown';
    }
  };

  const getPageContext = (pathname: string) => {
    switch (pathname) {
      case '/metrics':
        return { 
          page: 'metrics',
          features: ['cost-analysis', 'security-monitoring', 'anomaly-detection']
        };
      case '/guardrails':
        return { 
          page: 'guardrails',
          features: ['security-compliance', 'remediation-guidance']
        };
      case '/why-aws':
        return { 
          page: 'why-aws',
          features: ['migration-planning', 'cost-calculator', 'business-case']
        };
      case '/about':
        return { 
          page: 'about',
          features: ['team-info', 'company-overview']
        };
      case '/faq':
        return { 
          page: 'faq',
          features: ['help', 'support', 'documentation']
        };
      default:
        return { 
          page: 'home',
          features: ['overview', 'navigation', 'getting-started']
        };
    }
  };

  return {
    pathname: location.pathname,
    pageName: getPageName(location.pathname),
    pageContext: getPageContext(location.pathname)
  };
}




