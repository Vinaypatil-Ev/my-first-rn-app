import data from "@/constants/data";
import { useSyncExternalStore } from "react";

let subscriptions: Subscription[] = [...data.allSubs];
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);

  return () => listeners.delete(listener);
};

const getSnapshot = () => subscriptions;

export const useSubscriptions = () =>
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

export const addSubscription = (subscription: Subscription) => {
  subscriptions = [subscription, ...subscriptions];
  listeners.forEach((listener) => listener());
};
