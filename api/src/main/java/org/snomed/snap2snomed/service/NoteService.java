package org.snomed.snap2snomed.service;

import lombok.extern.slf4j.Slf4j;
import org.snomed.snap2snomed.model.Note;
import org.snomed.snap2snomed.model.User;
import org.snomed.snap2snomed.problem.DeleteProblem;
import org.snomed.snap2snomed.repository.NoteRepository;
import org.snomed.snap2snomed.security.AuthenticationFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Component;
import org.zalando.problem.Status;

import javax.transaction.Transactional;
import java.util.Optional;

@Slf4j
@Component
public class NoteService {
  @Autowired private AuthenticationFacade authenticationFacade;
  @Autowired private NoteRepository noteRepository;

  @Transactional
  public void deleteNote(Long noteId) {
    Optional<Note> optional = noteRepository.findById(noteId);

    if (optional.isPresent()) {
      Note note = optional.get();
      User currentUser = authenticationFacade.getAuthenticatedUser();
      boolean isNoteAuthor = note.getNoteBy().equals(currentUser);
      boolean isProjectOwner = note.getMapRow().getMap().getProject().getOwners().contains(currentUser);
      if (authenticationFacade.isAdminUser() || isNoteAuthor || isProjectOwner) {
        note.setDeleted(true);
        noteRepository.save(note);
      }
      else {
        throw new DeleteProblem("note", "Only map owners or the note author can delete a note",
            Status.METHOD_NOT_ALLOWED);
      }
    }
    else {
      throw new ResourceNotFoundException("No note exists with id: " + noteId);
    }
  }
}
