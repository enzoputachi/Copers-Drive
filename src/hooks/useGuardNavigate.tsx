import { useNavigate } from "react-router-dom";

export function useGuardedNavigate(
  shouldPrevent: boolean,
  message: string,
  onConfirm?: () => void
) {
  const navigate = useNavigate();

  return (to: string, opts?: Parameters<typeof navigate>[1]) => {
    if (shouldPrevent) {
      const ok = window.confirm(message);
      if (!ok) {
        // user cancelled, do nothing
        return;
      }
      // user confirmed: give caller a chance to reset store / cleanup
      onConfirm?.();
    }
    // either we didn’t guard, or they confirmed
    navigate(to, opts);
  };
}
