import { FaPizzaSlice, FaHamburger, FaIceCream, FaDrumstickBite } from "react-icons/fa";

export default function FoodLoader() {
  return (
    <div className="flex items-center justify-center h-screen bg-offWhite">
      <div className="relative flex space-x-6">
        <FaPizzaSlice className="text-oliveGreen text-4xl animate-floating delay-0" />
        <FaHamburger className="text-oliveGreen text-4xl animate-floating delay-150" />
        <FaIceCream className="text-oliveGreen text-4xl animate-floating delay-300" />
        <FaDrumstickBite className="text-oliveGreen text-4xl animate-floating delay-450" />
      </div>
    </div>
  );
}
