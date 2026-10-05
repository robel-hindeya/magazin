import { requireAuth } from '@/backend/auth/guards';
import { FamilyService } from '@/backend/services/family.service';
import { KidRepository } from '@/backend/db/repositories/kid.repository';
import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { redirect } from 'next/navigation';

import { FamilyPinSettingsCard } from '@/components/users/family-pin-settings-card';

export default async function FamilySettingsPage({
  searchParams,
}: {
  searchParams?: Promise<{ pinUpdated?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const isPinUpdated = resolvedSearchParams.pinUpdated === 'true';

  const user = await requireAuth();
  const familyService = new FamilyService();
  const family = await familyService.getMyFamily(user);

  async function updateFamilyAction(formData: FormData) {
    'use server';
    const currentUser = await requireAuth();
    const service = new FamilyService();
    const myFamily = await service.getMyFamily(currentUser);

    const familyName = formData.get('familyName') as string;
    const phone = formData.get('phone') as string;

    await service.updateFamily(currentUser, myFamily.id, {
      familyName,
      primaryContactPhone: phone,
    });

    redirect('/users/families');
  }

  async function addChildAction(formData: FormData) {
    'use server';
    const currentUser = await requireAuth();
    const service = new FamilyService();
    const myFamily = await service.getMyFamily(currentUser);
    const kidRepo = new KidRepository();

    const nickname = formData.get('nickname') as string;
    const age = parseInt(formData.get('age') as string, 10) || 8;
    const gradeLevel = formData.get('gradeLevel') as string;

    // Create child profile linked to this family
    await kidRepo.createKid({
      user_id: currentUser.id,
      nickname,
      age,
      grade_level: gradeLevel || 'Grade 3',
      family_id: myFamily.id,
      orbs: 50,
      words_written: 0,
      reading_level: 'Adventurer',
    });

    redirect('/users/families');
  }

  async function updatePinAction(formData: FormData) {
    'use server';
    const currentUser = await requireAuth();
    const service = new FamilyService();
    const pin = ((formData.get('pin') as string) || '').trim();

    if (/^\d{4}$/.test(pin)) {
      await service.setParentPin(currentUser, pin);
    }

    redirect('/users/families/settings?pinUpdated=true');
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <PageHeader
        title="Family Account & Security"
        description="Update household profile, enroll child explorers, and configure parental 4-digit PIN lock."
        breadcrumbs={[
          { label: 'Family Hub', href: '/users/families' },
          { label: 'Family Settings' },
        ]}
      />

      {/* Parental Lock PIN Card */}
      <FamilyPinSettingsCard
        currentPinExists={Boolean(family.parent_pin && family.parent_pin.length === 4)}
        pinUpdated={isPinUpdated}
        updatePinAction={updatePinAction}
      />

      {/* Profile Card */}
      <Card className="shadow-sm border border-slate-200/80 dark:border-purple-800/40 bg-white dark:bg-[#13092e]">
        <CardHeader>
          <CardTitle>Family Details</CardTitle>
          <CardDescription>Household name and primary contact</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateFamilyAction} className="space-y-4">
            <Input
              label="Family Name"
              name="familyName"
              defaultValue={family.family_name}
              required
            />
            <Input
              label="Parent Contact Phone"
              name="phone"
              defaultValue={family.primary_contact_phone || ''}
              placeholder="+1 (555) 000-0000"
            />
            <div className="flex justify-end">
              <Button type="submit" variant="emerald" className="font-black text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950">
                Save Family Details
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Add Child Section */}
      <Card id="add-child" className="shadow-sm border border-emerald-200 dark:border-emerald-800/50 bg-white dark:bg-[#13092e]">
        <CardHeader>
          <CardTitle>Enroll a Child Explorer</CardTitle>
          <CardDescription>
            Create an independent reading profile for your child
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={addChildAction} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <Input
                  label="Child Nickname"
                  name="nickname"
                  placeholder="e.g. Leo"
                  required
                />
              </div>
              <div>
                <Input
                  label="Age"
                  name="age"
                  type="number"
                  defaultValue="8"
                  min="4"
                  max="18"
                  required
                />
              </div>
              <div>
                <Input
                  label="Grade / Year"
                  name="gradeLevel"
                  placeholder="Grade 3"
                  defaultValue="Grade 3"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="emerald" className="font-black text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950">
                Enroll Child
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
