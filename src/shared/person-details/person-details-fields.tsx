import { CITIZENSHIPS, CITIZENSHIP_LABELS } from '@shared/models/citizenship';
import { GENDERS, GENDER_LABELS } from '@shared/models/gender';
import { READER_CATEGORIES, READER_CATEGORY_LABELS } from '@shared/models/reader-category';
import { BirthDateField } from './birth-date-field';
import { PersonNameFields } from './person-name-fields';
import { PersonOptionField } from './person-option-field';
import { PersonPhoneField } from './person-phone-field';

interface PersonDetailsFieldsProps {
  readonly today: string;
}

export function PersonDetailsFields({ today }: PersonDetailsFieldsProps) {
  return (
    <div className="@container">
      <div className="grid gap-4 @2xl:grid-cols-2 @2xl:gap-x-6 @2xl:gap-y-5">
        <div className="@2xl:col-start-2 @2xl:row-start-1">
          <PersonOptionField
            name="category"
            label="person.category"
            options={READER_CATEGORIES}
            optionLabels={READER_CATEGORY_LABELS}
          />
        </div>
        <div className="grid gap-4 @2xl:col-start-1 @2xl:row-span-3 @2xl:row-start-1 @2xl:grid-rows-subgrid @2xl:gap-y-5">
          <PersonNameFields />
        </div>
        <PersonOptionField
          name="gender"
          label="person.gender"
          options={GENDERS}
          optionLabels={GENDER_LABELS}
        />
        <BirthDateField today={today} />
        <PersonOptionField
          name="citizenship"
          label="person.citizenship"
          options={CITIZENSHIPS}
          optionLabels={CITIZENSHIP_LABELS}
        />
        <PersonPhoneField />
      </div>
    </div>
  );
}
