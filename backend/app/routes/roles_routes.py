from fastapi import  Depends, HTTPException, APIRouter
from typing import Annotated, List
from sqlalchemy.orm import Session
from app.models.user_model import User
from app.models.role_model import Role
from app.models.user_role_selection_model import UserRoleSelection
from app.schemas import (
    RoleResponse, RoleSelectionCreate, UserRoleSelectionResponse
)
from app.dependencies import SessionDep, get_curr_user

router = APIRouter()

@router.get("/roles", response_model=List[RoleResponse])
def get_roles(session: SessionDep):
    try:
        roles = session.query(Role).filter(Role.is_active == True).all()
        return [
            {
                "id": role.id,
                "title": role.title,
                "description": role.description,
                "tags": role.tags or [],
                "is_active": role.is_active
            }
            for role in roles
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get roles: {str(e)}")

@router.post("/my/roles")
def add_role_selection(
    role_data: RoleSelectionCreate,
    current_user: Annotated[User, Depends(get_curr_user)],
    session: SessionDep
    ):
    try:
        added_roles = []
        skipped_roles = []
        
        for role_id in role_data.role_ids:
            # Check if role exists and is active
            role = session.query(Role).filter(Role.id == role_id, Role.is_active == True).first()
            if not role:
                raise HTTPException(status_code=404, detail=f"Role with ID {role_id} not found or inactive")
            
            # Check if already selected
            existing_selection = session.query(UserRoleSelection).filter(
                UserRoleSelection.user_id == current_user.id,
                UserRoleSelection.role_id == role_id
            ).first()
            
            if existing_selection:
                skipped_roles.append(role_id)
                continue  # Skip if already selected
            
            # Add new selection
            role_selection = UserRoleSelection(user_id=current_user.id, role_id=role_id)
            session.add(role_selection)
            added_roles.append(role_id)
        
        session.commit()
        
        response_message = f"Successfully added {len(added_roles)} role(s)"
        if skipped_roles:
            response_message += f", skipped {len(skipped_roles)} already selected role(s)"
        
        return {
            "message": response_message,
            "added_role_ids": added_roles,
            "skipped_role_ids": skipped_roles
        }
        
    except HTTPException:
        raise
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to add role selections: {str(e)}")

@router.get("/my/roles", response_model=List[UserRoleSelectionResponse])
def get_user_roles(current_user: Annotated[User, Depends(get_curr_user)], session: SessionDep):
    try:
        role_selections = session.query(UserRoleSelection, Role).join(
            Role, UserRoleSelection.role_id == Role.id
        ).filter(
            UserRoleSelection.user_id == current_user.id,
            Role.is_active == True
        ).all()
        return [
            {
                "id": selection.id,
                "role_id": role.id,
                "role_title": role.title,
                "role_description": role.description,
                "role_tags": role.tags or [],
                "created_at": selection.created_at
            }
            for selection, role in role_selections
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get user roles: {str(e)}")


