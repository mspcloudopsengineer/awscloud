import { useState, useCallback } from 'react';
import { FilterConditionData } from './FilterCondition';
import { SavedFilter } from './SavedFilters';

const STORAGE_KEY = 'advancedFilters_saved';

export const useFilterBuilder = () => {
  const [conditions, setConditions] = useState<FilterConditionData[]>([]);
  const [logic, setLogic] = useState<'AND' | 'OR'>('AND');
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  const addCondition = useCallback((field: string, operator: string, value: string) => {
    if (!field || !value) return;
    const parsed = value.includes(',') ? value.split(',').map((v) => v.trim()) : value;
    setConditions((prev) => [...prev, { id: `cond-${Date.now()}`, field, operator, value: parsed }]);
  }, []);

  const removeCondition = useCallback((id: string) => {
    setConditions((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const clearAll = useCallback(() => setConditions([]), []);

  const saveFilter = useCallback((name: string) => {
    const newFilter: SavedFilter = {
      id: `filter-${Date.now()}`,
      name,
      conditions: conditions.map(({ field, operator, value }) => ({ field, operator, value })),
      logic,
      createdAt: new Date().toISOString(),
    };
    const updated = [...savedFilters, newFilter];
    setSavedFilters(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, [conditions, logic, savedFilters]);

  const deleteFilter = useCallback((id: string) => {
    const updated = savedFilters.filter((f) => f.id !== id);
    setSavedFilters(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, [savedFilters]);

  const applyFilter = useCallback((filter: SavedFilter) => {
    setConditions(filter.conditions.map((c, i) => ({ ...c, id: `cond-applied-${i}` })));
    setLogic(filter.logic);
  }, []);

  return { conditions, logic, setLogic, addCondition, removeCondition, clearAll, savedFilters, saveFilter, deleteFilter, applyFilter };
};

export default useFilterBuilder;
