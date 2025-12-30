import { shootConfetti, shootFireworks } from '../utils/confetti';

const confettiEffects = {
  default: shootConfetti,
  fireworks: shootFireworks
};

export function ConfettiButton({
  children,
  variant = "default",
  className = "",
  onClick,
  ...props
}) {
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    const origin = { x, y };

    const effect = confettiEffects[variant] || confettiEffects.default;
    effect(origin);
    onClick?.(e);
  };

  return (
    <button onClick={handleClick} className={className} {...props}>
      {children}
    </button>
  );
}

export default ConfettiButton;
