
export default function CategoryItem({ icon, name }) {
  return (
    <div className="text-center mb-4">
      <img
        src={icon}
        alt={name}
        className="border p-2"

        // chỉnh độ lớn hình ảnh
        width="70" 
        height="70"
      />
      <p className="mt-2 small">{name}</p>
    </div>
  );
}
