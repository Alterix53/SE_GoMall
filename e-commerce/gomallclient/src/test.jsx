import  React  from 'react';

<div className="container">
  {/* Header */}
  <div className="row">
    <div className="col-12 bg-primary text-white text-center p-3">
      <h1>Header</h1>
    </div>
  </div>

  {/* Content */}
  <div className="row">
    {/* Articles (chiếm 8/12 chiều ngang) */}
    <div className="col-md-8">
      <div className="mb-3 p-3 border">
        <h3>Article 1</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
      </div>
      <div className="p-3 border">
        <h3>Article 2</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
      </div>
    </div>

    {/* Sidebar (chiếm 4/12 chiều ngang) */}
    <div className="col-md-4 p-3 bg-light border">
      <h3>Sidebar</h3>
    </div>
  </div>

  {/* Footer */}
  <div className="row">
    <div className="col-12 bg-dark text-white text-center p-3 mt-3">
      <p>Footer</p>
    </div>
  </div>
</div>