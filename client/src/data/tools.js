import {
    Merge, Split, RotateCw, Lock, Unlock, Trash2,
    FileImage, FileType, FileText, FileSpreadsheet, FileCode, FilePenLine
} from 'lucide-react';

export const tools = [
    {
        id: 'edit-pdf',
        title: 'Edit PDF',
        description: 'Add text, images, and shapes to your PDF files online.',
        icon: FilePenLine,
        path: '/edit-pdf',
        color: '#f43f5e', // Rose
        category: 'utility'
    },
    {
        id: 'merge-pdf',
        title: 'Merge PDF',
        description: 'Combine multiple PDF files into one unified document.',
        icon: Merge,
        path: '/merge-pdf',
        color: '#4F46E5', // Indigo
        category: 'utility'
    },
    {
        id: 'split-pdf',
        title: 'Split PDF',
        description: 'Separate one page or a whole set for easy extraction.',
        icon: Split,
        path: '/split-pdf',
        color: '#EC4899', // Pink
        category: 'utility'
    },
    {
        id: 'compress-pdf',
        title: 'Compress PDF',
        description: 'Reduce file size while optimizing for maximal PDF quality.',
        icon: Merge, // Use appropriate icon
        path: '/compress-pdf',
        color: '#10B981', // Emerald
        category: 'utility'
    },
    {
        id: 'pdf-to-word',
        title: 'PDF to Word',
        description: 'Convert your PDF to editable WORD documents.',
        icon: FileText,
        path: '/pdf-to-word',
        color: '#3B82F6', // Blue
        category: 'convert-from',
        outputExtension: '.docx'
    },
    {
        id: 'pdf-to-ppt',
        title: 'PDF to Powerpoint',
        description: 'Turn your PDF into editable PPT and PPTX slides.',
        icon: FileType,
        path: '/pdf-to-ppt',
        color: '#F97316', // Orange
        category: 'convert-from',
        outputExtension: '.pptx'
    },
    {
        id: 'pdf-to-excel',
        title: 'PDF to Excel',
        description: 'Pull data straight from PDFs into Excel spreadsheets.',
        icon: FileSpreadsheet,
        path: '/pdf-to-excel',
        color: '#22C55E', // Green
        category: 'convert-from',
        outputExtension: '.xlsx'
    },
    {
        id: 'word-to-pdf',
        title: 'Word to PDF',
        description: 'Make DOC and DOCX files easy to read by converting them.',
        icon: FileText,
        path: '/word-to-pdf',
        color: '#3B82F6',
        category: 'convert-to'
    },
    {
        id: 'img-to-pdf',
        title: 'JPG to PDF',
        description: 'Convert JPG, PNG, BMP, GIF, and TIFF images to PDF.',
        icon: FileImage,
        path: '/image-to-pdf',
        color: '#F59E0B', // Amber
        category: 'convert-to',
        accept: 'image/*'
    },
    {
        id: 'html-to-pdf',
        title: 'HTML to PDF',
        description: 'Convert web pages to PDF documents.',
        icon: FileCode,
        path: '/html-to-pdf',
        color: '#EF4444', // Red
        category: 'convert-to',
        accept: '.html'
    },
    {
        id: 'rotate-pdf',
        title: 'Rotate PDF',
        description: 'Rotate your PDF files as you want.',
        icon: RotateCw,
        path: '/rotate-pdf',
        color: '#8B5CF6', // Violet
        category: 'utility'
    },
    {
        id: 'unlock-pdf',
        title: 'Unlock PDF',
        description: 'Remove PDF password security.',
        icon: Unlock,
        path: '/unlock-pdf',
        color: '#64748B', // Slate
        category: 'utility'
    },
    {
        id: 'protect-pdf',
        title: 'Protect PDF',
        description: 'Encrypt your PDF with a password.',
        icon: Lock,
        path: '/protect-pdf',
        color: '#1E293B', // Slate Dark
        category: 'utility'
    },
    {
        id: 'convert-image',
        title: 'Image Converter',
        description: 'Convert between JPG, PNG, WEBP, and TIFF formats.',
        icon: FileImage,
        path: '/convert-image',
        color: '#8B5CF6', // Violet
        category: 'convert-to',
        accept: 'image/*', // Accept all image types
        inputs: [
            {
                name: 'format',
                label: 'Select Output Format:',
                type: 'grid-select',
                defaultValue: 'png',
                options: [
                    { value: 'png', label: 'PNG' },
                    { value: 'jpg', label: 'JPG' },
                    { value: 'jpeg', label: 'JPEG' },
                    { value: 'webp', label: 'WebP' },
                    { value: 'gif', label: 'GIF' },
                    { value: 'bmp', label: 'BMP' },
                    { value: 'tiff', label: 'TIFF' },
                    { value: 'ico', label: 'ICO' },
                    { value: 'tga', label: 'TGA' },
                    { value: 'eps', label: 'EPS' }
                ]
            }
        ]
    },
    {
        id: 'resize-photo',
        title: 'Resize Photo',
        description: 'Resize and optimize your images to any dimension.',
        icon: FileImage,
        path: '#',
        color: '#06B6D4', // Cyan
        category: 'utility',
        comingSoon: true
    }
];
