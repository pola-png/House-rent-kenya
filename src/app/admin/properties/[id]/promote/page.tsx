'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function PromoteRedirect() {
  const router = useRouter();
  const params = useParams();
  
  useEffect(() => {
    const id = params?.id;
    if (id) {
      router.replace(`/admin/properties/promote?propertyId=${id}`);
    } else {
      router.replace('/admin/properties/promote');
    }
  }, [router, params]);

  return null;
}