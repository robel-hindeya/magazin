import { requireAuth } from '@/backend/auth/guards';
import { KidService } from '@/backend/services/kid.service';
import { UserService } from '@/backend/services/user.service';
import { TikTokProfile } from '@/components/users/tiktok-profile';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Explorer Profile | Selam Kids',
  description: 'View and customize your TikTok-style explorer profile, companion beast, and story creations.',
};

export default async function KidProfilePage({
  searchParams,
}: {
  searchParams?: Promise<{ saved?: string }>;
}) {
  const resolvedParams = searchParams ? await searchParams : {};
  const user = await requireAuth();
  const kidService = new KidService();
  const kid = await kidService.getMyProfile(user);

  async function updateCreatureAction(formData: FormData) {
    'use server';
    const currentUser = await requireAuth();
    const service = new KidService();
    const myKid = await service.getMyProfile(currentUser);

    const nickname = (formData.get('nickname') as string) || myKid.nickname;
    const creatureName = formData.get('creatureName') as string;
    const creatureType = formData.get('creatureType') as string;
    const creatureImageUrl = formData.get('creatureImageUrl') as string;
    const gradeLevel = (formData.get('gradeLevel') as string) || myKid.grade_level;

    await service.updateKidProfile(currentUser, myKid.id, {
      nickname,
      creatureName,
      creatureType,
      creatureImageUrl,
      gradeLevel,
    });

    redirect('/users/kids/profile?saved=creature');
  }

  async function updateProfileNameAction(formData: FormData) {
    'use server';
    const currentUser = await requireAuth();
    const service = new UserService();
    const fullName = formData.get('fullName') as string;

    await service.updateProfile(currentUser, currentUser.id, {
      fullName,
    });

    redirect('/users/kids/profile?saved=account');
  }

  const accountIdentifier =
    (user.metadata?.phoneNumber as string) || user.email || 'Registered Explorer Account';

  return (
    <div className="py-2 sm:py-4">
      <TikTokProfile
        user={user}
        kid={kid}
        accountIdentifier={accountIdentifier}
        updateCreatureAction={updateCreatureAction}
        updateProfileNameAction={updateProfileNameAction}
        savedStatus={resolvedParams.saved}
      />
    </div>
  );
}
