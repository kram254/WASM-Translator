import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Translator from '../frontend/components/Translator';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios'; 


jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Translator Component', () => {

    test('renders translator textarea', () => {
        render(<Translator />);
        const textareaElement = screen.getByRole('textbox');
        expect(textareaElement).toBeInTheDocument();
    });

    test('allows user to input text', () => {
        render(<Translator />);
        const textareaElement = screen.getByRole('textbox') as HTMLTextAreaElement;
        fireEvent.change(textareaElement, { target: { value: '测试' } });
        expect(textareaElement).toHaveValue('测试');
    });

    it('renders input, language selector, and translate button', () => {
        render(<Translator />);
        const textarea = screen.getByPlaceholderText(/enter text in chinese/i);
        const languageSelector = screen.getByLabelText(/select target languages/i);
        const button = screen.getByText(/translate/i);

        expect(textarea).toBeInTheDocument();
        expect(languageSelector).toBeInTheDocument();
        expect(button).toBeInTheDocument();
    });

    it('allows user to input text, select languages, and displays translations', async () => {
        // *Modified* - Setup mock response
        mockedAxios.post.mockResolvedValueOnce({
            data: {
                translatedText: 'Translated (english): 测试'
            }
        });
        mockedAxios.post.mockResolvedValueOnce({
            data: {
                translatedText: 'Translated (russian): 测试'
            }
        });

        render(<Translator />);
        const textarea = screen.getByPlaceholderText(/enter text in chinese/i);
        const languageSelector = screen.getByLabelText(/select target languages/i);
        const button = screen.getByText(/translate/i);

        // Input text
        fireEvent.change(textarea, { target: { value: '测试' } });
        expect(textarea).toHaveValue('测试');

        // Select languages (e.g., English and Russian)
        fireEvent.change(languageSelector, { target: { options: [
            { selected: true, value: 'english' },
            { selected: true, value: 'russian' }
        ] } });

        // Click translate
        fireEvent.click(button);

        // Wait for translations to appear
        await waitFor(() => {
            expect(screen.getByText(/english:/i)).toBeInTheDocument();
            expect(screen.getByText(/russian:/i)).toBeInTheDocument();
        });

        expect(screen.getByText('Translated (english): 测试')).toBeInTheDocument();
        expect(screen.getByText('Translated (russian): 测试')).toBeInTheDocument();
    });
    
    it('does not translate when input text is empty', async () => {
        render(<Translator />);
        const button = screen.getByText(/translate/i);

        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.queryByText(/translated/i)).not.toBeInTheDocument();
        });
    });

    it('does not translate when no language is selected', async () => {
        render(<Translator />);
        const textarea = screen.getByPlaceholderText(/enter text in chinese/i);
        const button = screen.getByText(/translate/i);

        fireEvent.change(textarea, { target: { value: '测试' } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.queryByText(/translated/i)).not.toBeInTheDocument();
        });
    });
});