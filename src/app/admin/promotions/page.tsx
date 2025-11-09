
import { useSearchParams } from 'next/navigation';

// ... inside the component, add this useEffect:
useEffect(() => {
  const searchParams = useSearchParams();
  const propId = searchParams.get('propertyId');
  const propTitle = searchParams.get('propertyTitle');
  
  if (propId) setPropertyId(propId);
  if (propTitle) setPropertyTitle(decodeURIComponent(propTitle));
}, []);
