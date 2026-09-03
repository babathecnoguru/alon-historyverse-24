(() => {
"use strict";

window.ALONData = {
async load(path) {
if (!path) {
return null;
}

  try {
    const response = await fetch(path, {
      cache: "no-cache"
    });

    if (!response.ok) {
      console.error(
        "ALONData: Failed to load",
        path,
        response.status
      );
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(
      "ALONData: Unable to load",
      path,
      error
    );

    return null;
  }
}

};
})();