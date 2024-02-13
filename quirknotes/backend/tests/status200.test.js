const cleardb = async () => {
  const clearRes = await fetch(`${SERVER_URL}/deleteAllNotes`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  })

  return clearRes;
}

const postNote = async (title, content) => {
  const postNoteRes = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      content: content,
    }),
  });

  return postNoteRes;
}

beforeEach(() => {
  cleardb();
});

test("1+2=3, empty array is empty", () => {
  expect(1 + 2).toBe(3);
  expect([].length).toBe(0);
});

const SERVER_URL = "http://localhost:4000";

test("/postNote - Post a note", async () => {
  const title = "NoteTitleTest";
  const content = "NoteTitleContent";

  const postNoteRes = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      content: content,
    }),
  });

  const postNoteBody = await postNoteRes.json();

  expect(postNoteRes.status).toBe(200);
  expect(postNoteBody.response).toBe("Note added succesfully.");
});

test("/getAllNotes - Return list of zero notes for getAllNotes", async () => {
  const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const getAllNotesBody = await getAllNotesRes.json();

  expect(getAllNotesRes.status).toBe(200);
  expect(getAllNotesBody.response.length).toBe(0);

});

test("/getAllNotes - Return list of two notes for getAllNotes", async () => {
  expect((await postNote("1", "1")).status).toBe(200);
  expect((await postNote("2", "2")).status).toBe(200);

  const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const getAllNotesBody = await getAllNotesRes.json();

  expect(getAllNotesRes.status).toBe(200);
  expect(getAllNotesBody.response.length).toBe(2);
});

test("/deleteNote - Delete a note", async () => {
  const postNoteRes = await postNote("1", "1");
  const postNoteId = (await postNoteRes.json()).insertedId;

  const deleteNoteRes = await fetch(`${SERVER_URL}/deleteNote/${postNoteId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    }
  });

  const deleteNoteBody = await deleteNoteRes.json();

  expect(deleteNoteRes.status).toBe(200);
  expect(deleteNoteBody.response).toBe(`Document with ID ${postNoteId} deleted.`);
});

test("/patchNote - Patch with content and title", async () => {
  const postNoteRes = await postNote("1", "1");
  expect(postNoteRes.status).toBe(200);
  const postNoteId = (await postNoteRes.json()).insertedId;

  const content = "hello";
  const title = "world";

  const patchNoteRes = await fetch(`${SERVER_URL}/patchNote/${postNoteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      content: content
    })
  });

  const patchNoteBody = await patchNoteRes.json();

  expect(patchNoteRes.status).toBe(200);
  expect(patchNoteBody.response).toBe(`Document with ID ${postNoteId} patched.`);
});

test("/patchNote - Patch with just title", async () => {
  const postNoteRes = await postNote("1", "1");
  expect(postNoteRes.status).toBe(200);
  const postNoteId = (await postNoteRes.json()).insertedId;

  const title = "world";

  const patchNoteRes = await fetch(`${SERVER_URL}/patchNote/${postNoteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
    })
  });

  const patchNoteBody = await patchNoteRes.json();

  expect(patchNoteRes.status).toBe(200);
  expect(patchNoteBody.response).toBe(`Document with ID ${postNoteId} patched.`);
});

test("/patchNote - Patch with just content", async () => {
  const postNoteRes = await postNote("1", "1");
  expect(postNoteRes.status).toBe(200);
  const postNoteId = (await postNoteRes.json()).insertedId;

  const content = "hello";

  const patchNoteRes = await fetch(`${SERVER_URL}/patchNote/${postNoteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: content
    })
  });

  const patchNoteBody = await patchNoteRes.json();

  expect(patchNoteRes.status).toBe(200);
  expect(patchNoteBody.response).toBe(`Document with ID ${postNoteId} patched.`);
});

test("/deleteAllNotes - Delete one note", async () => {
  expect((await postNote("1", "1")).status).toBe(200);
  
  const deleteAllRes  = await cleardb();
  const deleteAllBody = await deleteAllRes.json();

  expect(deleteAllRes.status).toBe(200);
  expect(deleteAllBody.response).toBe(`1 note(s) deleted.`);
});

test("/deleteAllNotes - Delete three notes", async () => {
  expect((await postNote("1", "1")).status).toBe(200);
  expect((await postNote("2", "2")).status).toBe(200);
  expect((await postNote("3", "3")).status).toBe(200);
  
  const deleteAllRes  = await cleardb();
  const deleteAllBody = await deleteAllRes.json();

  expect(deleteAllRes.status).toBe(200);
  expect(deleteAllBody.response).toBe(`3 note(s) deleted.`);
});

test("/updateNoteColor - Update color of a note to red (#FF0000)", async () => {
  const postNoteRes = await postNote("1", "1");
  expect(postNoteRes.status).toBe(200);
  const postNoteId = (await postNoteRes.json()).insertedId;

  const updateColorRes = await fetch(`${SERVER_URL}/updateNoteColor/${postNoteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      color: "red"
    })
  });

  const updateColorBody = await updateColorRes.json();

  expect(updateColorRes.status).toBe(200);
  expect(updateColorBody.response).toBe('Note color updated successfully.');
});
