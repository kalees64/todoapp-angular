import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextEditorComponent } from '../components/text-editor/text-editor.component';

@NgModule({
  declarations: [TextEditorComponent],
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [TextEditorComponent],
})
export class SharedModuleModule {}
