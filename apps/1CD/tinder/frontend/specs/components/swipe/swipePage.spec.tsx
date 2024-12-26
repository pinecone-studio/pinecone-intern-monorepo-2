import Swiper from "@/app/(main)/swipe/functionalities/Swiper"
import { render } from '@testing-library/react';

describe('should render swipe page',()=>{
    it('should render',()=>{
        render(<Swiper/>);
    });
});