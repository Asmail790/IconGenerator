import type { Meta, StoryObj } from "@storybook/react";
import ColorSelector from "../app/generator/_components/color-selector";
import { useState } from "react";
import { StyledPagination } from "@/app/collection/_components/styled-only-pagination";

const meta = {
  title: "pagination",
  component: StyledPagination,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof StyledPagination>;

export default meta;

type Story = StoryObj<typeof StyledPagination>;



export const onePage: Story = {
    args:{
        activeIndexInWindow:0,
        lastPageNumber:0,
        urlPageWindow:[{url:"fake",page:0}]
    }

};
export const twoPageFirstActive: Story = {
    args:{
        activeIndexInWindow:0,
        lastPageNumber:1,
        urlPageWindow:[{url:"fake",page:0},{url:"fake",page:1}]
    }

};


export const twoPageLastActive: Story = {
    args:{
        activeIndexInWindow:1,
        lastPageNumber:1,
        urlPageWindow:[{url:"fake",page:0},{url:"fake",page:1}]
    }

};

export const threePageMiddleActive: Story = {
    args:{
        activeIndexInWindow:1,
        lastPageNumber:2,
        urlPageWindow:[{url:"fake",page:0},{url:"fake",page:1},{url:"fake",page:2}]
    }

};

export const lastPageNumberOutsideWindow: Story = {
    args:{
        activeIndexInWindow:1,
        lastPageNumber:8,
        urlPageWindow:[{url:"fake",page:0},{url:"fake",page:1},{url:"fake",page:2}]
    }

};






