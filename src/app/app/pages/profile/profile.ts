import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { User, UserService } from '../../services/user';
import { WalletService } from '../../services/wallet.service';
import { UserToolbar } from '../../../shared/user-toolbar/user-toolbar';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    UserToolbar,
    HttpClientModule,
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
})
export class Profile implements OnInit {
  currentUser: User | null = null;

  // Form
  editForm: FormGroup;
  editPopup = false;
  previewImage: string | ArrayBuffer | null = null;
  selectedFile?: File;

  // Wallet
  walletBalance = 0;
  transactionHistory: any[] = [];
  presetAmounts = [10, 50, 100, 200, 500, 1000, 2500, 0];
  selectedAmount = 100;
  customAmountVisible = false;

  constructor(
    private userService: UserService,
    private walletService: WalletService,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      username: ['', Validators.required],
      profile_image: [null],
    });
  }

  ngOnInit() {
    this.loadUser();
    this.loadWallet();
  }

  loadUser() {
    this.userService.me().subscribe((user) => {
      this.currentUser = user;
      this.editForm.patchValue({
        username: user.username,
        profile_image: null,
      });
      if (user.balance !== undefined) this.walletBalance = user.balance;
    });
  }

  openEditPopup() {
    this.editPopup = true;
    this.previewImage = this.currentUser?.profile_image || null;
  }

  closeEditPopup() {
    this.editPopup = false;
    this.selectedFile = undefined;
    this.previewImage = null;
  }

  onFileChange(event: any) {
    const file: File | undefined = event.target.files?.[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => (this.previewImage = reader.result);
      reader.readAsDataURL(file);
    }
  }

  saveChanges() {
    const formData = new FormData();
    formData.append('username', this.editForm.value.username);
    if (this.selectedFile) formData.append('profile_image', this.selectedFile);

    this.userService.updateProfile(formData).subscribe({
      next: () => {
        this.closeEditPopup();
        this.loadUser();
      },
      error: (err) => {
        console.error(err);
        alert('เกิดข้อผิดพลาดในการบันทึก');
      },
    });
  }

  // Wallet
  loadWallet() {
    this.walletService
      .getBalance()
      .subscribe((res) => (this.walletBalance = res.balance));
    this.walletService
      .getTransactions()
      .subscribe((res) => (this.transactionHistory = res));
  }

  selectAmount(amount: number) {
    if (amount === 0) {
      this.customAmountVisible = true;
      this.selectedAmount = 0;
    } else {
      this.customAmountVisible = false;
      this.selectedAmount = amount;
    }
  }

  confirmTopUp() {
    if (this.selectedAmount > 0) {
      this.walletService.topUp(this.selectedAmount).subscribe((res) => {
        this.walletBalance = res.balance;
        this.transactionHistory.unshift({
          date: new Date(),
          type: 'topup',
          amount: this.selectedAmount,
          description: 'เติมเงินเข้า',
        });
        this.selectedAmount = 0;
        this.customAmountVisible = false;
      });
    }
  }
}
