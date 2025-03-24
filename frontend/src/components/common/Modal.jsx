import { HiXMark } from "react-icons/hi2";

export default function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-500" onClick={onClose}>
            <div className="fixed inset-0 bg-black opacity-25"></div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg w-1/2 relative z-10" onClick={(e) => e.stopPropagation()}>
                <button className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100" onClick={onClose}>
                    <HiXMark className="text-gray-500 w-6 h-6" />
                </button>
                {children}
            </div>
        </div>
    );
}