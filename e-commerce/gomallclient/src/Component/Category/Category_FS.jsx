export default function Category_FS() {
  return (
    <section className="bg-white py-4">
      <div className="container">
        <h5 className="fw-bold mb-4">Category</h5>
        <div className="row row-cols-2 row-cols-sm-3 row-cols-md-5 row-cols-lg-6 g-3">
          {categories.map((item, index) => (
            <div className="col" key={index}>
              <CategoryItem icon={item.icon} name={item.name} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}