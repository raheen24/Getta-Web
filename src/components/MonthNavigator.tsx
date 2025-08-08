import React from 'react';
import { BsChevronLeft, BsChevronRight, BsCalendar } from 'react-icons/bs';

interface MonthNavigatorProps {
    currentMonth: string;
    onPrev: () => void;
    onNext: () => void;
}

const MonthNavigator: React.FC<MonthNavigatorProps> = ({ currentMonth, onPrev, onNext }) => {
    return (
        <div className="d-flex justify-content-center align-items-center gap-2 py-3">
            <button
                className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
                style={{ width: '32px', height: '32px', padding: 0 }}
                onClick={onPrev}
            >
                <BsChevronLeft />
            </button>

            <div
    className="d-flex align-items-center justify-content-center fw-semibold text-primary-emphasis"
    style={{ minWidth: '200px', gap: '8px' }} 
>
    <BsCalendar color="seagreen" />
    <span>
        Month: <span className="fw-bold text-dark">{currentMonth}</span>
    </span>
</div>


            <button
                className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
                style={{ width: '32px', height: '32px', padding: 0 }}
                onClick={onNext}
            >
                <BsChevronRight />
            </button>
        </div>
    );
};

export default MonthNavigator;
