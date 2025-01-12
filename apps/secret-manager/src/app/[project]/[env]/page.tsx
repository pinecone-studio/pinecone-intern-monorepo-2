'use client';

import { useParams } from 'next/navigation';
import { Project } from 'src/app/page';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import * as _ from 'lodash';
import { Loader2, Trash } from 'lucide-react';
import { useConfirmation } from 'src/app/_components/ConfirmationProvider';

type Params = {
  project: string;
  env: string;
};
const envFieldMap = {
  development: 'dev',
  testing: 'test',
  production: 'prod',
} as const;
type Secret = {
  key: string;
  value: string;
};

const Page = () => {
  const { project, env } = useParams<Params>();
  const { confirm } = useConfirmation();

  const [data, setData] = useState<Secret[]>([]);
  const [editables, setEditables] = useState<Secret[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleKeyChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEditables = [...editables];

    newEditables[index].key = e.target.value;

    setEditables(newEditables);
  };

  const handleValueChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEditables = [...editables];

    newEditables[index].value = e.target.value;

    setEditables(newEditables);
  };

  const handleAddSecret = () => {
    setEditables([...editables, { key: '', value: '' }]);
  };

  const handleDeleteSecret = (index: number) => () => {
    const newEditables = [...editables];

    newEditables.splice(index, 1);

    setEditables(newEditables);
  };

  const confirmDeleteSecret = (index: number) => () => {
    confirm({
      message: 'Are you sure you want to delete this secret?',
      fn: handleDeleteSecret(index),
    });
  };

  const handleRevert = () => {
    setEditables([...data].map((item) => ({ ...item })));
  };

  const handleSave = async () => {
    setSaving(true);

    const secrets = editables.reduce((acc, { key, value }) => {
      acc[key] = value;

      return acc;
    }, {} as Record<string, string>);

    await fetch(`/api/groups/${project}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        [envFieldMap[env as keyof typeof envFieldMap]]: secrets,
      }),
    });

    setSaving(false);
  };

  const confirmSave = () => {
    confirm({
      message: 'Are you sure you want to save these changes?',
      fn: handleSave,
    });
  };

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const response = await fetch(`/api/groups/${project}`);

      const data: Project = await response.json();

      const secrets = data.secrets[envFieldMap[env as keyof typeof envFieldMap] as keyof Project['secrets']];

      const toArr = Object.entries(secrets).map(([key, value]) => ({
        key,
        value,
      }));

      setData(toArr.map((item) => ({ ...item })));
      setEditables(toArr.map((item) => ({ ...item })));

      setLoading(false);
    };

    fetchProjects();
  }, [env, project]);

  if (loading) return null;

  return (
    <div className="flex flex-col gap-4">
      {editables.map((secret, index) => (
        <div key={index} className="flex items-center gap-4">
          <Input className="flex-[1]" placeholder="Key" value={secret.key} onChange={handleKeyChange(index)} />
          <Input className="flex-[2]" placeholder="Value" value={secret.value} onChange={handleValueChange(index)} />
          <Button variant="outline" onClick={confirmDeleteSecret(index)}>
            <Trash size={16} />
          </Button>
        </div>
      ))}

      <div className="flex items-center justify-end gap-4">
        {!_.isEqual(data, editables) && (
          <Button variant="outline" onClick={handleRevert}>
            Revert
          </Button>
        )}

        <Button size="sm" variant="default" onClick={handleAddSecret}>
          Add Secret
        </Button>

        <Button variant="outline" disabled={_.isEqual(data, editables)} onClick={confirmSave}>
          {saving ? <Loader2 size={12} className="animate-spin" /> : 'Save'}
        </Button>
      </div>
    </div>
  );
};
export default Page;
