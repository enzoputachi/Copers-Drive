import { ReactNode, MouseEvent } from "react";
import { Link, LinkProps, useNavigate } from "react-router-dom";

interface ConfirmNavLinkProps extends Omit<LinkProps, "to"> {
  to: string;
  shouldPrevent: boolean;
  message: string;
  onConfirm?: () => void;
  children: ReactNode;
}

export function ConfirmNavLink({
  to,
  shouldPrevent,
  message,
  onConfirm,
  children,
  ...linkProps
}: ConfirmNavLinkProps) {
  const navigate = useNavigate();

  const handleConfirmNavigation = () => {
    const ok = window.confirm(message);
    if (!ok) return false;
    onConfirm?.();
    navigate(to);
    return true;
  };

  const handleClickCapture = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!shouldPrevent) return;
    // capture phase: stop the native <a> navigation before it happens
    e.preventDefault();
  };

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!shouldPrevent) return;
    // now show confirm and do your manual navigate
    e.preventDefault();
    handleConfirmNavigation();
  };

  return (
    <Link
      // set href="#" so a fallback won't send you somewhere else
      to="#"
      onClickCapture={handleClickCapture}
      onClick={handleClick}
      {...linkProps}
    >
      {children}
    </Link>
  );
}
