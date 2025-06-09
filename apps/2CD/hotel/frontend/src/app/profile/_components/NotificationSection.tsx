'use client';

import React, { useState } from 'react';
import FormSectionWrapper from './FormSectionWrapper';

const NotificationSection = () => {
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);

  return (
    <FormSectionWrapper title="Notifications">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="emailNotif"
          checked={emailNotif}
          onChange={(e) => setEmailNotif(e.target.checked)}
        />
        <label htmlFor="emailNotif" className="text-sm">
          Enable email notifications
        </label>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="smsNotif"
          checked={smsNotif}
          onChange={(e) => setSmsNotif(e.target.checked)}
        />
        <label htmlFor="smsNotif" className="text-sm">
          Enable SMS notifications
        </label>
      </div>
    </FormSectionWrapper>
  );
};

export default NotificationSection;
