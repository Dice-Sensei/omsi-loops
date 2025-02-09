import { AttributeList } from './AttributeList.tsx';
import { BuffList } from './BuffList.tsx';
import { ResourceList } from './ResourceList.tsx';
import { SkillList } from './SkillList.tsx';

export const Stats = () => (
  <div class='flex flex-col gap-4 overflow-y-auto'>
    <ResourceList />
    <AttributeList />
    <SkillList />
    <BuffList />
  </div>
);
