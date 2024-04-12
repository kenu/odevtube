import idx from '../../web/public/js/index.js'

describe('getLastVideoIndex function', () => {
  beforeEach(() => {
     // Set up a basic DOM structure
     document.body.innerHTML = `
       <ul id="list">
         <li data-v="1">Video 1</li>
         <li data-v="2">Video 2</li>
         <li data-v="3">Video 3</li>
       </ul>
     `;
  });

  test('returns the correct index of the last video', () => {
     // Mock the videos array
     const videos = [
       { videoId: '1', title: 'Video 1' },
       { videoId: '2', title: 'Video 2' },
       { videoId: '3', title: 'Video 3' },
     ];

     // Call the getLastVideoIndex function
     const lastIndex = idx.getLastVideoIndex(videos);

     // Assert the correct index is returned
     expect(lastIndex).toBe(2);
  });
 });
