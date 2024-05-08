// "use client";
// import axios from "axios";
// import {useEffect, useState} from "react";
// import * as cheerio from "react-dom/test-utils";
//
//
//
//  export default  function Test() {
//      const stringifyData =  getData()
//
//      const [parsedHTML, setParsedHTML] = useState(stringifyData);
//
//      useEffect(() => {
//          // Parse HTML content when component mounts
//          const $ = cheerio.load(stringifyData)
//          //  const $ = cheerio.lo;
//          const parsed = $('body').html(); // Assuming you want to render the body of the fetched HTML
//          setParsedHTML(parsed);
//      }, [stringifyData]);
//
//
//
//   return (
//       <div>
//           <div dangerouslySetInnerHTML={{ __html: parsedHTML }} />
//       </div>
//   )
// }
//
// async function getData() {
//     const res = await axios.get("https://google.com");
//     return res.data
// }