// TagSelector.advanced.spec.tsx
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TagSelector from '@/components/profile/steps/TagSelector';
import { TAGS } from '@/utils/tags';

describe('TagSelector - Advanced Functionality and Edge Cases', () => {
    let onChange: jest.Mock;

    beforeEach(() => {
        onChange = jest.fn();
    });

    it('prevents selecting more than 10 tags and covers maximum capacity logic', () => {
        const initial = TAGS.slice(0, 10).map(t => t.id);
        render(<TagSelector onChange={onChange} initialSelected={initial} />);
        const dropdownBtn = screen.getAllByRole('button')[0];
        fireEvent.click(dropdownBtn);

        const extraTag = screen.getByText(TAGS[10].label);
        expect(extraTag).toHaveClass('bg-gray-100', 'text-gray-400', 'cursor-not-allowed');

        // This covers the else branch in toggleTag when selected.length >= 10
        fireEvent.click(extraTag);
        expect(onChange).toHaveBeenCalledWith(initial);
        expect(onChange).not.toHaveBeenCalledWith([...initial, TAGS[10].id]);
    });

    it('handles invalid tag IDs and filters undefined labels', () => {
        // Test with only invalid IDs - should show placeholder
        render(<TagSelector onChange={onChange} initialSelected={['invalid-id']} />);
        expect(screen.getByText("Select your interests")).toBeInTheDocument();

        // Test with mixed valid and invalid IDs - should show only valid tags
        render(<TagSelector onChange={onChange} initialSelected={[TAGS[0].id, 'invalid-id', TAGS[1].id]} />);
        expect(screen.getByText(TAGS[0].label)).toBeInTheDocument();
        expect(screen.getByText(TAGS[1].label)).toBeInTheDocument();
        expect(screen.getByText("Select your interests")).toBeInTheDocument();
    });

    it('covers filter(Boolean) functionality with mixed valid and invalid tags', () => {
        const validTag = TAGS[0].id;
        const invalidTag1 = 'invalid-tag-1';
        const invalidTag2 = 'invalid-tag-2';
        const mixedTags = [validTag, invalidTag1, invalidTag2];

        render(<TagSelector onChange={onChange} initialSelected={mixedTags} />);

        // Should show only the valid tag (invalid tags get filtered out by filter(Boolean))
        expect(screen.getByText(TAGS[0].label)).toBeInTheDocument();
        expect(screen.queryByText("Select your interests")).not.toBeInTheDocument();
    });

    it('covers ternary operator false branch and else branch logic at maximum capacity', () => {
        const initial = TAGS.slice(0, 10).map(t => t.id);
        render(<TagSelector onChange={onChange} initialSelected={initial} />);
        onChange.mockClear();

        const dropdownBtn = screen.getAllByRole('button')[0];
        fireEvent.click(dropdownBtn);

        const extraTag = screen.getByText(TAGS[10].label);
        expect(extraTag).toHaveClass('bg-gray-100', 'text-gray-400', 'cursor-not-allowed');

        // This covers lines 29-33 in toggleTag else branch and ternary operator false branch
        fireEvent.click(extraTag);
        expect(onChange).toHaveBeenCalledWith(initial);
    });

    it('covers event listener addition when dropdown is open', () => {
        const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

        render(<TagSelector onChange={onChange} />);

        // Open dropdown to trigger the event listener addition
        const dropdownBtn = screen.getAllByRole('button')[0];
        fireEvent.click(dropdownBtn);

        // Verify that addEventListener was called with 'mousedown'
        expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));

        addEventListenerSpy.mockRestore();
    });
});