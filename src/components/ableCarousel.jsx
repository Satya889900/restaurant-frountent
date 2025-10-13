import Slider from "react-slick";
import TableCard from "./TableCard";

const TableCarousel = ({ tables, onBook }) => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024, // screens < 1024px
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 768, // screens < 768px
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div className="px-4 md:px-8 lg:px-16">
      <Slider {...settings}>
        {tables.map((table) => (
          <div key={table._id || table.tableNumber} className="px-2">
            <TableCard table={table} onBook={onBook} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default TableCarousel;
