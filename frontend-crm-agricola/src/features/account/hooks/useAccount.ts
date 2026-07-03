import { useCallback, useEffect, useState } from 'react';

import {
  createTransferOpposition,
  getMyAccount,
  getMyArcoRequests,
  updateMyAccount,
} from '../services/account.service';
import type { AccountUser, ArcoRequest, UpdateAccountData } from '../types/account.types';

interface UseAccountResult {
  account: AccountUser | null;
  requests: ArcoRequest[];
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  saveAccount: (data: UpdateAccountData) => Promise<AccountUser>;
  opposeTransfers: (reason: string) => Promise<ArcoRequest>;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudo completar la operacion.';
}

export function useAccount(): UseAccountResult {
  const [account, setAccount] = useState<AccountUser | null>(null);
  const [requests, setRequests] = useState<ArcoRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const [accountData, requestData] = await Promise.all([getMyAccount(), getMyArcoRequests()]);
      setAccount(accountData);
      setRequests(requestData);
    } catch (requestError: unknown) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialData(): Promise<void> {
      try {
        const [accountData, requestData] = await Promise.all([getMyAccount(), getMyArcoRequests()]);

        if (isMounted) {
          setAccount(accountData);
          setRequests(requestData);
        }
      } catch (requestError: unknown) {
        if (isMounted) {
          setError(getErrorMessage(requestError));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  async function saveAccount(data: UpdateAccountData): Promise<AccountUser> {
    const updated = await updateMyAccount(data);
    setAccount(updated);

    return updated;
  }

  async function opposeTransfers(reason: string): Promise<ArcoRequest> {
    const created = await createTransferOpposition(reason);
    const [updatedAccount, updatedRequests] = await Promise.all([
      getMyAccount(),
      getMyArcoRequests(),
    ]);
    setAccount(updatedAccount);
    setRequests(updatedRequests);

    return created;
  }

  return {
    account,
    requests,
    isLoading,
    error,
    reload,
    saveAccount,
    opposeTransfers,
  };
}
