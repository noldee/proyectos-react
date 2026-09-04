export const Square = ({ children, isSelected, updateBoard, index }) => {
  const className = `square ${isSelected ? "is-selected" : ""}`;

  const handleClick = () => {
    // Si updateBoard existe (en la sección de turnos no se pasa, por eso validamos)
    if (updateBoard) {
      updateBoard(index);
    }
  };

  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  );
};
