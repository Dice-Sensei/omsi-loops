import { AttributeList } from './AttributeList.tsx';
import { BuffList } from './BuffList.tsx';
import { SkillList } from './SkillList.tsx';

export const Stats = () => (
  <div class='flex flex-col gap-4 overflow-auto'>
    <AttributeList />
    <SkillList />
    <BuffList />
  </div>
);
