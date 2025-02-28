import { useEffect } from "react";
import Home from "./component/home";


function App() {
  useEffect(() => {
    const loadScript = (src, callback) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = callback;
      document.body.appendChild(script);
    };

    // Load jQuery first, then Bootstrap, then other plugins
    loadScript("/js/jquery.js", () => {
        loadScript("/js/plugins.js", () => {
          loadScript("/js/function.js");
        });
    });

    return () => {
      document.querySelectorAll("script").forEach((script) => {
        if (script.src.includes("jquery") || script.src.includes("bootstrap") || script.src.includes("plugins") || script.src.includes("function")) {
          document.body.removeChild(script);
        }
      });
    };
  }, []);

  return (
    <Home/>
  );
}

export default App;
