import axios from 'axios';
// @desc    Search for books from Gutendex (Public Domain)
// @route   GET /api/books/external
// @access  Public
export const searchExternalBooks = async (req, res) => {
    try {
        const { search, page } = req.query;

        // Construct the Gutendex URL
        // Documentation: https://gutendex.com/
        let url = 'https://gutendex.com/books';

        const params = {};
        if (search) params.search = search;
        if (page) params.page = page;

        const response = await axios.get(url, { params });

        // Return the data directly from Gutendex
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching data from Gutendex:', error.message);
        res.status(500).json({
            message: 'Failed to fetch data from external book service',
            error: error.message
        });
    }
};