import type { ActivityDataRecord, CommonResponse } from '../types/domain';
import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

interface EmissionContextType {
  records: ActivityDataRecord[];
  addActivityRecord: (record: Omit<ActivityDataRecord, 'id' | 'status' | 'submittedBy' | 'submittedByName' | 'calculatedEmission'>) => CommonResponse<ActivityDataRecord>;
  submitForReview: (recordId: string) => CommonResponse<ActivityDataRecord>;
  approveRecord: (recordId: string, reviewerId: string, reviewerName: string) => CommonResponse<ActivityDataRecord>;
  rejectRecord: (recordId: string, reviewerId: string, reviewerName: string, remarks: string) => CommonResponse<ActivityDataRecord>;
}

const EmissionContext = createContext<EmissionContextType | undefined>(undefined);

export const EmissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<ActivityDataRecord[]>([]);
  const { user } = useAuth();

  const addActivityRecord = (
    data: Omit<ActivityDataRecord, 'id' | 'status' | 'submittedBy' | 'submittedByName' | 'calculatedEmission'>
  ): CommonResponse<ActivityDataRecord> => {
    const emissionTonnes = Number(((data.activityValue * data.factorApplied) / 1000).toFixed(3));

    const newRecord: ActivityDataRecord = {
      ...data,
      id: `em-${Date.now()}`,
      calculatedEmission: emissionTonnes,
      status: 'DRAFT',
      submittedBy: user?.id || 'usr-anon',
      submittedByName: user?.name || 'Anonymous User',
    };

    setRecords((prev) => [newRecord, ...prev]);

    return {
      status: 'CREATED',
      response: {
        action: 'IngestActivityDataSuccess',
        data: newRecord,
      },
      message: `Activity record successfully ingested into GHG calculation engine. Calculated: ${emissionTonnes} tCO2e.`,
    };
  };

  const submitForReview = (recordId: string): CommonResponse<ActivityDataRecord> => {
    let updated: ActivityDataRecord | null = null;
    setRecords((prev) =>
      prev.map((rec) => {
        if (rec.id === recordId) {
          updated = {
            ...rec,
            status: 'SUBMITTED',
            submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          };
          return updated;
        }
        return rec;
      })
    );

    return {
      status: 'OK',
      response: {
        action: 'SubmitActivityDataSuccess',
        data: updated!,
      },
      message: 'Record state transitioned to SUBMITTED. Locked for reviewer inspection.',
    };
  };

  const approveRecord = (
    recordId: string,
    reviewerId: string,
    reviewerName: string
  ): CommonResponse<ActivityDataRecord> => {
    const target = records.find((r) => r.id === recordId);
    if (!target) {
      return {
        status: 'NOT_FOUND',
        response: { action: 'ApproveRecordFailure', data: null as any },
        message: 'Activity record not found',
      };
    }

    if (target.submittedBy === reviewerId) {
      return {
        status: 'FORBIDDEN',
        response: { action: 'SegregationOfDutiesViolation', data: target },
        message: 'SEGREGATION OF DUTIES GUARD: Reviewer is strictly forbidden from approving their own activity submission.',
      };
    }

    const updated: ActivityDataRecord = {
      ...target,
      status: 'APPROVED',
      reviewedBy: reviewerId,
      reviewedByName: reviewerName,
      reviewedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setRecords((prev) => prev.map((r) => (r.id === recordId ? updated : r)));

    return {
      status: 'OK',
      response: {
        action: 'ApproveActivityDataSuccess',
        data: updated,
      },
      message: 'Data record APPROVED and locked. Calculations included in annual carbon rollup.',
    };
  };

  const rejectRecord = (
    recordId: string,
    reviewerId: string,
    reviewerName: string,
    remarks: string
  ): CommonResponse<ActivityDataRecord> => {
    const target = records.find((r) => r.id === recordId);
    if (!target) {
      return {
        status: 'NOT_FOUND',
        response: { action: 'RejectRecordFailure', data: null as any },
        message: 'Activity record not found',
      };
    }

    if (!remarks || remarks.trim().length < 10) {
      return {
        status: 'BAD_REQUEST',
        response: { action: 'ValidationFailure', data: target },
        message: 'VALIDATION ERROR: Rejection remarks are mandatory and must be at least 10 characters in length.',
      };
    }

    const updated: ActivityDataRecord = {
      ...target,
      status: 'REJECTED',
      reviewedBy: reviewerId,
      reviewedByName: reviewerName,
      reviewedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      rejectionRemarks: remarks,
    };

    setRecords((prev) => prev.map((r) => (r.id === recordId ? updated : r)));

    return {
      status: 'OK',
      response: {
        action: 'RejectActivityDataSuccess',
        data: updated,
      },
      message: 'Record state marked REJECTED. Sent back to Data Provider with actionable comments.',
    };
  };

  return (
    <EmissionContext.Provider
      value={{
        records,
        addActivityRecord,
        submitForReview,
        approveRecord,
        rejectRecord,
      }}
    >
      {children}
    </EmissionContext.Provider>
  );
};

export const useEmission = () => {
  const context = useContext(EmissionContext);
  if (!context) throw new Error('useEmission must be used within EmissionProvider');
  return context;
};
