import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { I_USER } from '../register/user.model';
import { UserService } from '../../sevices/user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styles: ``,
})
export class ProfileComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private location: Location
  ) {}

  id!: number;

  user!: I_USER;

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.userService.getUserById(this.route.snapshot.params['id']).subscribe(
      (res: any) => {
        this.user = res.data;
      },
      (error: Error) => {
        console.log(error);
      }
    );
  }
}
