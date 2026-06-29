import { useParams } from 'react-router-dom';
import { PublicProducerProfileView } from '../../../producer-profile';

export function PublicProducerPage() {
  const { profileId } = useParams<{ profileId: string }>();

  if (!profileId) {
    return <div className="alert alert-warning m-4">No se especificó un perfil.</div>;
  }

  return <PublicProducerProfileView profileId={profileId} />;
}
