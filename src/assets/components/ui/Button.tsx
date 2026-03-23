type Props = {
  children: any;
  onClick?: () => void;
  variant?: "primary" | "danger" | "outline";
};

export default function Button({ children, onClick, variant = "primary" }: Props) {
  return (
    <button className={`btn ${variant}`} onClick={onClick}>
      {children}
    </button>
  );
}