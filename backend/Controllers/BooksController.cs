using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("[controller]")]
public class BooksController : ControllerBase
{
    private readonly BookstoreContext _context;

    public BooksController(BookstoreContext context)
    {
        _context = context;
    }

    // Query to return pages of data
    [HttpGet]
    public IActionResult GetBooks(int pageNum = 1, int pageSize = 5, string sortOrder = "asc", string? category = null)
    {
        var query = _context.Books.AsQueryable();

        // Filter by category
        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(b => b.Category == category);
        }

        query = sortOrder == "desc"
            ? query.OrderByDescending(b => b.Title)
            : query.OrderBy(b => b.Title);

        var totalNumBooks = query.Count();

        var books = query
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        return Ok(new { books, totalNumBooks });
    }


    // Get unique categories
    [HttpGet("GetBookCategories")]
    public IActionResult GetBookCategories()
    {
        var categories = _context.Books
            .Select(b => b.Category)
            .Distinct()
            .ToList();

        return Ok(categories);
    }

    // Add a new book
    [HttpPost("AddBook")]
    public async Task<IActionResult> AddBook([FromBody] Book book)
    {
        _context.Books.Add(book);
        await _context.SaveChangesAsync();
        return Ok(book);
    }

    // Update an existing book
    [HttpPut("UpdateBook/{bookId}")]
    public async Task<IActionResult> UpdateBook(int bookId, [FromBody] Book updatedBook)
    {
        var existingBook = await _context.Books.FindAsync(bookId);
        if (existingBook == null)
        {
            return NotFound();
        }

        existingBook.Title = updatedBook.Title;
        existingBook.Author = updatedBook.Author;
        existingBook.Publisher = updatedBook.Publisher;
        existingBook.ISBN = updatedBook.ISBN;
        existingBook.Classification = updatedBook.Classification;
        existingBook.Category = updatedBook.Category;
        existingBook.PageCount = updatedBook.PageCount;
        existingBook.Price = updatedBook.Price;

        await _context.SaveChangesAsync();
        return Ok(existingBook);
    }

    // Delete a book
    [HttpDelete("DeleteBook/{bookId}")]
    public async Task<IActionResult> DeleteBook(int bookId)
    {
        var book = await _context.Books.FindAsync(bookId);
        if (book == null)
        {
            return NotFound();
        }

        _context.Books.Remove(book);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}