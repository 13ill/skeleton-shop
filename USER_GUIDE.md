# Jump-1 User Guide - Display Order Management

## Overview

Jump-1 provides two display modes for showing products on the customer-facing website:
- **Interleaved Mode**: Products alternate between categories
- **Grouped Mode**: Products are grouped by category

As an admin, you can control the display order of both categories and products through the admin dashboard.

---

## Getting Started

### Access Admin Dashboard

1. Navigate to `http://localhost:5173/admin`
2. Login with your credentials:
   - Email: `admin@test.com`
   - Password: `password123`
3. You will see the Products Management page

---

## Category Order Management

### What is Category Priority?

Category priority determines the order in which categories appear in **interleaved mode**. Lower priority numbers appear first.

Example:
- Priority 1: Rings
- Priority 2: Necklaces
- Priority 3: Earrings

In interleaved mode, this would display as: Ring 1, Necklace 1, Earring 1, Ring 2, Necklace 2, Earring 2, ...

### How to Reorder Categories

1. On the admin dashboard, locate the **Category Order** panel on the left side
2. Click and drag any category item to move it up or down
3. Release the mouse to drop it in the new position
4. The system will automatically:
   - Update the priority numbers
   - Save the new order to the database
   - Show a "Saving..." indicator while processing
   - Show a "Saved!" confirmation when complete

### Visual Feedback

- **Dragging**: The item being dragged will have a golden border and appear slightly larger
- **Saving**: A spinner and "Saving..." text appear in the header
- **Success**: A green checkmark and "Saved!" text appear briefly
- **Error**: An alert will show if the save fails, and the order will revert

---

## Product Order Management

### What are Product Orders?

Products have two types of order:

1. **Global Order**: Used in **interleaved mode** - determines the overall position across all products
2. **Category Order**: Used in **grouped mode** - determines the position within a specific category

### How to Reorder Products

1. On the admin dashboard, locate the **Product Order** panel
2. Use the **Display Mode** toggle to switch between:
   - **Interleaved**: Reorder products across all categories
   - **Grouped**: Reorder products within a specific category
3. Click and drag any product item to move it up or down
4. Release the mouse to drop it in the new position
5. The system will automatically:
   - Update the order numbers
   - Save the new order to the database
   - Show a "Saving..." indicator while processing
   - Show a "Saved!" confirmation when complete

### Filtering by Category

1. In the Category Order panel, click on a category to select it
2. The Product Order panel will now show only products from that category
3. Reorder products within that category
4. Click "Show All Products" to return to viewing all products

### Visual Feedback

- **Dragging**: The item being dragged will have a golden border, appear slightly larger, and have reduced opacity
- **Saving**: A spinner and "Saving..." text appear in the header
- **Success**: A green checkmark and "Saved!" text appear briefly
- **Error**: An alert will show if the save fails, and the order will revert

---

## Display Modes Explained

### Interleaved Mode

**Best for:** Showcasing variety and keeping customers engaged

**How it works:**
- Products alternate between categories based on category priority
- Example: Ring 1, Necklace 1, Earring 1, Ring 2, Necklace 2, Earring 2, ...

**When to use:**
- When you want to show a mix of all product types
- When you have similar numbers of products in each category
- When you want to encourage browsing across categories

### Grouped Mode

**Best for:** Focused browsing and comparison

**How it works:**
- Products are grouped by category
- Example: Ring 1, Ring 2, Ring 3, ..., Necklace 1, Necklace 2, Necklace 3, ...

**When to use:**
- When customers are looking for specific product types
- When you want to make it easy to compare similar products
- When categories have very different numbers of products

---

## Previewing Changes

### Admin Preview

1. After reordering, you can preview the changes on the admin dashboard
2. The Product Order panel shows the current order in real-time
3. Use the Display Mode toggle to see how products will appear in each mode

### Customer View Preview

1. Click the "Preview" button in the admin dashboard
2. This will open the customer-facing website in a new tab
3. Navigate to the home page to see the current display order
4. Use the display mode toggle on the customer page to switch between interleaved and grouped views

---

## Troubleshooting

### Changes Not Saving

**Problem:** You drag and drop but the order reverts

**Possible Causes:**
- Network connection issue
- Server is not responding
- Authentication token expired

**Solutions:**
1. Check your internet connection
2. Refresh the page and try again
3. Logout and login again to refresh your authentication
4. Check the browser console for error messages

### Images Not Loading

**Problem:** Product images show as placeholders

**Possible Causes:**
- Backend server is not running
- Image files are missing
- Path configuration issue

**Solutions:**
1. Ensure the backend server is running on `http://localhost:3001`
2. Check that image files exist in the `public/Product/` directory
3. Verify the `.env.local` file has the correct `VITE_API_BASE_URL`

### Performance Issues

**Problem:** Drag and drop feels slow or unresponsive

**Possible Causes:**
- Large number of products
- Slow network connection
- Browser performance issues

**Solutions:**
1. Filter by category to reduce the number of items displayed
2. Check your network connection speed
3. Try using a different browser
4. Consider reducing the number of products displayed per page

---

## Best Practices

### Category Ordering

1. **Order by popularity**: Put your most popular categories first
2. **Balance categories**: Try to keep similar numbers of products in each category for interleaved mode
3. **Seasonal adjustments**: Update category priorities based on seasonal trends

### Product Ordering

1. **Featured products first**: Put your best-selling or newest products at the top
2. **Logical grouping**: Group related products together in grouped mode
3. **Regular updates**: Review and update product orders regularly to keep the display fresh

### Display Mode Selection

1. **Use interleaved** for:
   - Homepage
   - Landing pages
   - When you want to showcase variety

2. **Use grouped** for:
   - Category pages
   - Search results
   - When customers are looking for specific items

---

## Keyboard Shortcuts

Currently, keyboard shortcuts are not implemented for drag and drop operations. Use your mouse to drag and drop items.

---

## Mobile Support

The admin dashboard is responsive and works on mobile devices, but drag and drop operations are optimized for desktop use with a mouse or trackpad.

---

## Support

If you encounter any issues or have questions:

1. Check the browser console for error messages
2. Review the API documentation for endpoint details
3. Contact the development team for assistance

---

## API Integration

If you need to integrate display order management with external systems, refer to the [API Documentation](./API_DOCUMENTATION.md) for detailed endpoint information.

---

## Version History

- **v1.0** (2026-06-15): Initial release with drag and drop, visual feedback, and retry mechanism
